interface ProfileCardProps{
    avatar: string
    name: string
    username: string
    followers: number
    following: number
    public_repos: number
    profile_url: string
}

function ProfileCard (props: ProfileCardProps) {
    return (
        <div>
            <div className="flex gap-50">
                <div className="mb-6">
                    <img className="w-32 h-32 rounded-full " src={props.avatar} alt={`${props.name}'s profile image`}/>
                </div>
                <div className="border rounded-lg mb-6 gap-6 p-6">
                    <h3>Name: {props.name}</h3>
                    <p>Username: {props.username}</p>
                </div>
            
                <div className="border rounded-lg gap-6 mb-6 p-4">
                    <p>Followers: {props.followers}</p>
                    <p>Following: {props.following}</p>
                    <p>Public Repositories: {props.public_repos}</p>
                </div>
            </div>
            <div className="border rounded-lg mb-6 p-6">
                <a href={props.profile_url} target="_blank" rel="noopener noreferrer">
                    GitHub Profile
                </a>
            </div>
        </div>
    )
}
export default ProfileCard