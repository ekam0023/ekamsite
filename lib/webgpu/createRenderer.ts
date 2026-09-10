export interface RendererOptions {
  canvas: HTMLCanvasElement;
}

export interface Renderer {
  /** Resolves once the WebGPU device, pipeline, and render loop are up. Rejects on failure. */
  ready: Promise<void>;
  /** Tears down all GPU resources, observers, and the animation loop. Safe to call multiple times. */
  dispose: () => void;
}

/**
 * Creates a small WebGPU "transmission" renderer: a fullscreen triangle with a
 * time-animated refraction/glass-like shader. Mirrors the original example's
 * shape (`ready` promise + `dispose()`), adapted for Next.js client components.
 */
export function createRenderer({ canvas }: RendererOptions): Renderer {
  let device: GPUDevice | null = null;
  let context: GPUCanvasContext | null = null;
  let pipeline: GPURenderPipeline | null = null;
  let uniformBuffer: GPUBuffer | null = null;
  let bindGroup: GPUBindGroup | null = null;
  let rafId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let disposed = false;
  const startTime = performance.now();

  const shaderCode = /* wgsl */ `
    struct Uniforms {
      time: f32,
      aspect: f32,
    };
    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    struct VertexOut {
      @builtin(position) position: vec4f,
      @location(0) uv: vec2f,
    };

    @vertex
    fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOut {
      var pos = array<vec2f, 3>(
        vec2f(-1.0, -1.0),
        vec2f(3.0, -1.0),
        vec2f(-1.0, 3.0)
      );
      var out: VertexOut;
      out.position = vec4f(pos[idx], 0.0, 1.0);
      out.uv = pos[idx] * 0.5 + 0.5;
      return out;
    }

    fn transmission(uv: vec2f, t: f32) -> vec3f {
      let p = uv * 2.0 - 1.0;
      let r = length(p);
      let wave = sin(r * 12.0 - t * 1.6) * 0.5 + 0.5;
      let refract = p / (1.0 + r * 2.0);
      let base = vec3f(0.05, 0.08, 0.12);
      let glass = vec3f(0.3, 0.6, 0.9) * wave * smoothstep(1.2, 0.0, r);
      let highlight = pow(max(1.0 - r, 0.0), 6.0) * vec3f(1.0, 1.0, 1.0);
      return base + glass * 0.6 + highlight * 0.4 + vec3f(refract * 0.05, 0.0);
    }

    @fragment
    fn fs_main(in: VertexOut) -> @location(0) vec4f {
      let color = transmission(in.uv, uniforms.time);
      return vec4f(color, 1.0);
    }
  `;

  async function init(): Promise<void> {
    if (typeof navigator === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
      throw new Error("WebGPU is not supported in this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("No GPU adapter found.");

    const dev = await adapter.requestDevice();
    if (disposed) {
      dev.destroy();
      return;
    }
    device = dev;

    const ctx = canvas.getContext("webgpu");
    if (!ctx) throw new Error("Failed to acquire a WebGPU canvas context.");
    context = ctx;

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "premultiplied" });

    const shaderModule = device.createShaderModule({ code: shaderCode });

    uniformBuffer = device.createBuffer({
      size: 8, // time: f32, aspect: f32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } }],
    });

    bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
      vertex: { module: shaderModule, entryPoint: "vs_main" },
      fragment: { module: shaderModule, entryPoint: "fs_main", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    if (!disposed) frame();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function frame() {
    if (disposed || !device || !context || !pipeline || !uniformBuffer || !bindGroup) return;

    const t = (performance.now() - startTime) / 1000;
    const aspect = canvas.width / Math.max(1, canvas.height);
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([t, aspect]));

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);

    rafId = requestAnimationFrame(frame);
  }

  const ready = init().catch((err) => {
    console.error("[createRenderer] initialization failed:", err);
    throw err;
  });

  function dispose() {
    if (disposed) return;
    disposed = true;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;

    uniformBuffer?.destroy();
    uniformBuffer = null;

    context?.unconfigure();
    context = null;

    device?.destroy();
    device = null;

    pipeline = null;
    bindGroup = null;
  }

  return { ready, dispose };
}
