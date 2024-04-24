import * as fal from "@fal-ai/serverless-client";
import { NextResponse } from "next/server";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

export async function POST(req: Request) {
  const {prompt, negativePrompt} = await req.json();

  const result: { images: { url: string; height: number; width: number }[] } =
    await fal.subscribe("fal-ai/lora", {
      input: {
        prompt: prompt + ", sticker",
        image_size: "square_hd",
        negativePrompt: negativePrompt,
        model_name: "stabilityai/stable-diffusion-xl-base-1.0",
        guidance_scale: 7.5,
        num_inference_steps: 25,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

  const imageInfo = result.images[0];
  return new NextResponse(JSON.stringify(imageInfo), { status: 200 });
}