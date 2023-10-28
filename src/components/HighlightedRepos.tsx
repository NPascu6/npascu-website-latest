const HighlightedRepos = () => {
    return <div className="m-2 mx-4 p-4 text-start card">
        <p>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/NPascu6/npascu-website-latest"
                className={` font-bold`}
            >
                Current web app (react - tailwind.css).
            </a>
        </p>
        {/* <p>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/NPascu6/ASP_.NET_Starter_API"
                className={` font-bold`}
            >
                .NET Core 6 API
            </a>
        </p> */}
        <p>
            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/NPascu6/npascu_net_api_v2"
                className={`font-bold`}
            >
                Personal API - (.NET Core 7.0)
            </a>
        </p>
    </div>
}

export default HighlightedRepos;