export function SubmitButton({
  children,
  pending,
  pendingText,
  ...props
}: {
  children: string
  pending?: boolean
  pendingText?: string
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      {...props}
      className="cursor-pointer rounded-lg bg-purple-600 px-4 py-1 font-bold text-white hover:bg-purple-500"
    >
      {pending ? pendingText : children}
    </button>
  )
}
