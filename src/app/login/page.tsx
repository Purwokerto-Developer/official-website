import { LoginForm } from '@/components/auth/login-form';
import { getServerSession } from '@/lib/better-auth/get-session';
import { isSafeInternalPath } from '@/lib/redirect-with-next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const LoginPage = async ({ searchParams }: { searchParams?: { next?: string } }) => {
  const session = await getServerSession();
  const next = searchParams?.next;

  if (session) {
    if (next && isSafeInternalPath(next)) {
      redirect(next);
    }
    redirect('/u/dashboard');
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-6 h-8 w-8 items-center justify-center rounded-md border bg-white p-1">
            <Image src={'/img-logo.png'} alt="PurwokertoDev Logo" height={50} width={50} />
          </div>
          PurwokertoDev
        </a>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
