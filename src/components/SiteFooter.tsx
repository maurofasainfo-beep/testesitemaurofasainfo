import original from "@/lib/original-page.json";

export function SiteFooter() {
  return <><footer className="rodape" dangerouslySetInnerHTML={{ __html: original.footer }} />
    <div dangerouslySetInnerHTML={{ __html: original.floating + original.symbols }} /></>;
}
