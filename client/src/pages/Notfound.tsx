import { Helmet } from "react-helmet-async";

export default function Notfound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Talkie</title>
        <meta
          name="description"
          content="The page you were looking for on Talkie could not be found."
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-3xl font-semibold text-gray-800">404</p>
          <p className="text-lg text-gray-600 mt-2">Page not found</p>
        </div>
      </div>
    </>
  );
}
