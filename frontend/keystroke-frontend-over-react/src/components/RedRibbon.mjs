function RedRibbon() {
    const ribbons = []
    for (let i = 0; i < 51; i++) {
        ribbons.push(<svg height="25" width="25">
            <polygon points="7,0 0,25 18,25 25,0" style={{fill: "red"}}/>
        </svg>)
    }
    return (
        <div className={"ribbon-container"}>
            {ribbons}
        </div>
    )
}

export default RedRibbon