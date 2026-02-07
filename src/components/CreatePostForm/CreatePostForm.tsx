import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";

interface CreatePostFormProps {
  onClose: () => void;
}

interface FormValue {
  title: string;
  body: string;
}
const initialValues: FormValue = {
  title: "",
  body: "",
};
const validationSchema = Yup.object().shape({
  title: Yup.string().min(3, "Minimum 3 characters").max(50, "Maximum 50 characters").required(),
  body: Yup.string().min(3, "Minimum 3 characters").max(500, "Maximum 500 characters").required(),
});

export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success("Post created successfully");
    },
  });

  const handleSubmit = (values: FormValue, actions: FormikHelpers<FormValue>) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="body">Content</label>
            <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
            <ErrorMessage name="body" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting" : "Create post"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
