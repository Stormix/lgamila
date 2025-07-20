'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClientProvider } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { BsFire } from 'react-icons/bs';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/store';
import { useSuggestStreamer } from '@/store/mutations/suggest-streamer';

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Streamer name must be at least 2 characters.',
    }),
    twitchUsername: z.string().optional(),
    kickUsername: z.string().optional(),
  })
  .refine((data) => data.twitchUsername || data.kickUsername, {
    message: 'At least one streaming platform username is required.',
    path: ['twitchUsername'],
  });

export function SuggestStreamerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      twitchUsername: '',
      kickUsername: '',
    },
  });
  const { mutate: suggestStreamer, isPending: isLoading } =
    useSuggestStreamer();

  function onSubmit(values: z.infer<typeof formSchema>) {
    suggestStreamer({
      name: values.name,
      twitchUsername: values.twitchUsername || '',
      kickUsername: values.kickUsername || '',
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Suggest a Moroccan Streamer
        </CardTitle>
        <p className="text-muted-foreground text-center">
          Help us expand our list of Moroccan streamers by suggesting someone
          new!
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Streamer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the streamer's name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name or real name of the streamer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="twitchUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitch Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Twitch username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kickUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kick Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Kick username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center">
              <Button
                className="w-fit"
                disabled={isLoading}
                isLoading={isLoading}
                size="lg"
                type="submit"
              >
                {!isLoading && <BsFire />}
                Submit Suggestion
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function () {
  return (
    <QueryClientProvider client={queryClient}>
      <SuggestStreamerForm />
    </QueryClientProvider>
  );
}
