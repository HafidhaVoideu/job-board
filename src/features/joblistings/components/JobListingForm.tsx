"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import { jobListingSchema } from "@/features/joblistings/actions/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import z from "zod";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatters";
import { StateSelectItems } from "./StateSelectItem";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/LoadingSwap";
import createJobListing from "../actions/actions";
import { toast } from "sonner";

const NON_SELECT_VALUE = "none";
const JobListingForm = () => {
  const form = useForm({
    resolver: zodResolver(jobListingSchema),
    defaultValues: {
      title: "",
      description: "",
      experienceLevel: "junior",
      locationRequirement: "in-office",
      type: "full-time",
      wage: null,
      wageInterval: "yearly",
      city: null,
      stateAbbreviation: null,
    },
  });

  async function onSubmit(data: z.infer<typeof jobListingSchema>) {
    const response = await createJobListing(data);
    if (response.error) {
      toast.error(response.message);
    }

    // console.log("data:", data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-y-6 gap-x-4 items-start">
          {/* job title */}
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>job title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          ></FormField>

          {/* wage */}
          <FormField
            name="wage"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>wage</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="rounded-r-none"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            isNaN(e.target.valueAsNumber)
                              ? null
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>

                    {/* wageInterval */}

                    <FormField
                      name="wageInterval"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(val) =>
                                field.onChange(val ?? null)
                              }
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-l-none">
                                  /<SelectValue />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {wageIntervals.map((interval) => (
                                  <SelectItem key={interval} value={interval}>
                                    {formatWageInterval(interval)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* second rwo  */}
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-y-6 gap-x-4 items-start">
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-y-6 gap-x-2 items-start">
            {/* city */}
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>city</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            ></FormField>

            {/* stateabbreviation */}
            <FormField
              name="stateAbbreviation"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === NON_SELECT_VALUE ? null : val)
                      }
                    >
                      <FormLabel>state</FormLabel>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {field.value !== null && (
                          <SelectItem
                            className="text-muted-foreground"
                            value={NON_SELECT_VALUE}
                          >
                            clear
                          </SelectItem>
                        )}
                        <StateSelectItems></StateSelectItems>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* location requirement */}

          <FormField
            name="locationRequirement"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormLabel>location requirements</FormLabel>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {locationRequirements.map((locationRequirement) => (
                        <SelectItem
                          key={locationRequirement}
                          value={locationRequirement}
                        >
                          {formatLocationRequirement(locationRequirement)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* job type */}

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobListingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatJobType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* experience level */}
          <FormField
            name="experienceLevel"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((experience) => (
                      <SelectItem key={experience} value={experience}>
                        {formatExperienceLevel(experience)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Create Job Listing
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};

export default JobListingForm;
