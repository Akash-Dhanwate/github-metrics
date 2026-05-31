interface ProfileCardProps {
    avatar: string
    name: string
    username: string
    followers: number
    following: number
    public_repos: number
    profile_url: string
}

function ProfileCard(props: ProfileCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="flex items-start gap-6">
                <img 
                    src={props.avatar} 
                    alt={props.name}
                    className="w-24 h-24 rounded-full"
                />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{props.name}</h2>
                    <p className="text-gray-600">@{props.username}</p>
                    <div className="flex gap-6 mt-4">
                        <div>
                            <p className="text-2xl font-bold">{props.followers}</p>
                            <p className="text-gray-600 text-sm">Followers</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{props.following}</p>
                            <p className="text-gray-600 text-sm">Following</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{props.public_repos}</p>
                            <p className="text-gray-600 text-sm">Repos</p>
                        </div>
                    </div>
                </div>
                <a 
                    href={props.profile_url}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Visit Profile
                </a>
            </div>
        </div>
    )
}
export default ProfileCard