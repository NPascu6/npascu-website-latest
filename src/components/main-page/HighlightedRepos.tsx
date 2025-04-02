const HighlightedRepos = () => {
    return (
        <div className="m-2 mx-4 p-4 text-start card">
            <p>
                <a
                    style={{textDecoration: "underline"}}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/NPascu6/npascu-website-latest"
                    className={` font-bold`}
                >
                    Pascu.io:
                </a>
                <span className="ml-4">
          Created with React 18, Tailwind Css, Redux, React Router, and deployed
          to my personal GoDaddy domain, with github actions and FTP Deploy.
        </span>
            </p>
            <p className="mt-3">
                <a
                    style={{textDecoration: "underline"}}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/NPascu6/npascu-api-v1"
                    className={`font-bold`}
                >
                    Personal API:
                </a>
                <span className="ml-4">
                    Created with .net 8 in order to provide the tickers from finnhub to this website.
                </span>
            </p>
            <p className="mt-3">
                <a
                    style={{textDecoration: "underline"}}
                    rel="noopener noreferrer"
                    target="_blank"
                    className={`font-bold`}
                    href="https://github.com/NPascu6/andrei-mylenses.ch"
                >
                    Andrei-Mylenses:
                </a>
                <span className="ml-4">
          Created with React 19, Tailwind Css, Redux and deployed
          to my personal GoDaddy domain, with github actions and FTP Deploy,
          which you can access my clicking:
          <span
              className="font-bold ml-2 cursor-pointer"
              style={{textDecoration: "underline"}}
              onClick={() => window.open("https://andrei-mylenses.ch", "_blank")}
          >
            andrei-mylenses.ch
          </span>
        </span>
            </p>
            <p className="mt-3">
                <a
                    style={{textDecoration: "underline"}}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/NPascu6/design-patterns-c-sharp?tab=readme-ov-file"
                    className={` font-bold`}
                >
                    Design Patterns C Sharp Examples:
                </a>
                <span className="ml-4">
          Multiple Console Applications with examples of Design Patterns in C#
        </span>
            </p>
        </div>
    );
};

export default HighlightedRepos;
