import {apiClient} from "@/app/handlers/api-client";
import { AddPasswordFormType } from "./types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"

//wip
export const addPasswordHandler = async (data: AddPasswordFormType) => {
  await apiClient({
    url: "/api/users",
    options: {
      method: "POST",
      body: data,
    },
  });
};

export const useAddPasswordHandler = () => {

  return useMutation({
    mutationFn: addPasswordHandler,
    onSuccess: () => {
      toast.success("Contest form submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit contest form. Try again later.");
    },
  });
};
