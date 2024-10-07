export default function Whats() {
  return (
    <div id="whats" className="flex flex-col gap-8 items-center w-full">
      <div className="flex flex-col gap-3 items-center w-full md:w-7/12 2xl:w-5/12">
        <h1 className="text-3xl font-bold text-center">What's JSX Mail?</h1>
        <p className="text-center text-sm text-zinc-400">
          JSX Mail is not just a framework, a library, or a cloud service. It is
          a complete email workflow tool that allows you to build emails, send
          emails, host your images, and much more.
        </p>
      </div>

      <div className="flex items-center flex-col md:flex-row justify-center w-full sm:w-10/12">
        <div className="p-5 overflow-hidden bg-zinc-900 rounded-3xl flex flex-col gap-4 pb-0 pr-0 w-full h-80 2xl:h-96 md:w-6/12 2xl:w-5/12">
          <div>
            <h2 className="text-xl font-medium">Cloud</h2>
            <p className="text-sm text-zinc-500 whitespace-nowrap">
              Send email, host images, get analytics from your email
              campaigns...
            </p>
          </div>

          <img
            src="/cloud.svg"
            alt="cloud"
            className="w-full h-full object-cover object-left-top"
          />
        </div>

        <div className="p-5 overflow-hidden bg-zinc-900 rounded-3xl flex flex-col gap-4 pb-0 pr-0 w-full h-80 2xl:h-96 md:w-6/12 2xl:w-5/12 -mt-20 md:mt-0 md:-ml-20 2xl:-ml-32 shadow-[0_-10px_10px_rgba(0,0,0,0.3)] md:shadow-[-10px_0_10px_rgba(0,0,0,0.3)]">
          <div>
            <h2 className="text-xl font-medium">Framework</h2>
            <p className="text-sm text-zinc-500 whitespace-nowrap">
              A modern framework for creating email templates
            </p>
          </div>

          <img
            src="/full-code.svg"
            alt="cloud"
            className="w-full h-full object-cover object-left-top"
          />
        </div>
      </div>
    </div>
  );
}
