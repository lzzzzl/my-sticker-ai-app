"use client";

import * as fal from "@fal-ai/serverless-client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import Navbar from "./navbar";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

const FormSchema = z.object({
  prompt: z.string(),
  negativePrompt: z.string(),
});

export default function Home() {
  const router = useRouter();

  const [imageUrl, setImage] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      negativePrompt:
        "noisy, sloppy, messy, grainy, highly detailed, ultra textured, photo, NSFW",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setImage("");
      setIsLoading(true);
      const response = await axios.post(`/api/sticker`, {
        prompt: data.prompt,
        negativePrompt: data.negativePrompt,
      });
      setImage(response.data.url);
      setImageWidth(response.data.width);
      setImageHeight(response.data.height);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-40 pt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-5 flex flex-col sm:flex-row">
            <div className="sm:w-1/2 flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prompt{" "}
                      <span className="text-gray-400 font-normal">
                        (Type what you want to create)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        placeholder="Cute cat eating fish."
                        rows={3}
                        required={true}
                        {...field}
                      ></Textarea>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="negativePrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Negative Prompt{" "}
                      <span className="text-gray-400 font-normal">
                        (Type what you don&apos;t want to create)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full justify-center mt-2"
                disabled={form.formState.isSubmitting}
              >
                Run
              </Button>
            </div>
            <div className="sm:w-1/2 flex flex-col gap-y-4">
              <div className="sm:px-5 py-3 sm:py-0">
                <div className="relative transition-opacity duration-300">
                  {!imageUrl ? (
                    <div className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 min-h-[240px]">
                      {isLoading && <Loader />}
                      {isLoading && (
                        <div className="opacity-50 h-[20px] text-[#1f2937]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-image"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 min-h-[240px]">
                      <div className="absolute top-3 right-4 group inline-flex space-x-2 z-20">
                        <a
                          href={imageUrl}
                          download="sticker.png"
                          target="_blank"
                          className="flex flex-row space-x-2 items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-download icon-sm"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" x2="12" y1="15" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                      <Image
                        src={imageUrl}
                        width={imageWidth}
                        height={imageHeight}
                        // layout={"fill"}
                        alt="Generated Image"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
