import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const defaultRole = params.role === "seller" ? "seller" : "buyer";
  return <RegisterForm defaultRole={defaultRole} />;
}
