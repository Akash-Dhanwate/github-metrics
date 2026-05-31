interface StatsCardProp{
    title: string
    value: string | number
}

function StatsCard (props: StatsCardProp) {
    return (
        <div className= "border rounded-lg p-4 mb-6">
            <h3>
                {props.title}
            </h3>
            <p>
                {props.value}
            </p>
        </div>
    )
}
export default StatsCard