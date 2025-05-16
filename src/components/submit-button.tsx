export function SubmitButton({
  children,
  pending,
  pendingText,
  ...props
}: {
  children: string;
  pending?: boolean;
  pendingText?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      {...props}
      className="bg-purple-600 text-white px-4 py-1 rounded-lg font-bold cursor-pointer hover:bg-purple-500"
    >
      {pending ? pendingText : children}
    </button>
  );
}
