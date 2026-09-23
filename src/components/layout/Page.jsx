import Navbar from "../Navbar";
import Footer from "./Footer";

export default function Page({ children, mainClassName = "", ...navbarProps }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar {...navbarProps} />
      <div className={`flex-1 ${mainClassName}`}>{children}</div>
      <Footer />
    </div>
  );
}
