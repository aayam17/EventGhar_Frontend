import { useNavigate } from "react-router-dom";
import Page from "../components/layout/Page";
import Button from "../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <span className="inline-block -rotate-2 bg-marigold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
          Error 404
        </span>
        <h1 className="mt-6 font-display text-4xl uppercase leading-tight text-ink md:text-6xl">
          This page left
          <br />
          <span className="text-raspberry">before the show.</span>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-600">
          The link may be old, or the page may have moved. Head back and find
          something to go to.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" onClick={() => navigate("/")}>
            Browse events
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate("/contact")}>
            Contact us
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default NotFound;
