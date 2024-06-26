import RootLayout from "../RootLayout";
import ErrorMessage from "../components/ErrorMessage";

function ErrorPage() {
  return (
    <>
      <RootLayout>
        <ErrorMessage errorMessage={`404 Error`} />
      </RootLayout>
    </>
  );
}

export default ErrorPage;
