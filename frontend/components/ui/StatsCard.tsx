interface StatsCardProp {
    title: string
    value: string | number
}

function StatsCard(props: StatsCardProp) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-gray-600 text-sm font-medium">{props.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{props.value}</p>
        </div>
    )
}
export default StatsCard