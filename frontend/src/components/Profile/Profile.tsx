import { useAuth } from "../../contexts/UserContext";

export function Profile() {
	const { state } = useAuth();
	const user = state.user;

	return (
		<main className="min-h-[calc(100vh-5rem)] w-full px-4 py-10 text-stone-100">
			<div /* className="mx-auto w-full lg:w-[60%]" */>
				<header className="mb-8 flex items-center gap-6">
					<img
						src={user?.avatarUrl ? `${user.avatarUrl}` : "/api/assets/avatars/default1.png"}
						alt="Profile avatar"
						className="h-24 w-24 rounded-full border-2 border-emerald-300/40 object-cover"
						onError={(e) => {
							e.currentTarget.src = "/api/assets/avatars/default1.png";
						}}
					/>
					<h1 className="text-4xl font-extrabold tracking-tight text-emerald-100">
						{user?.username || user?.username || "User"}
					</h1>
				</header>
				<section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
					<div className="bg-white/5 p-4 rounded-xl text-center">
						<p className="text-gray-400 text-sm uppercase">Victories</p>
						<p className="text-3xl font-bold text-green-400">{user?.score?.wins || 0}</p>
					</div>
					<div className="bg-white/5 p-4 rounded-xl text-center">
						<p className="text-gray-400 text-sm uppercase">Defeats</p>
						<p className="text-3xl font-bold text-red-400">{user?.score?.losses || 0}</p>
					</div>
					<div className="bg-white/5 p-4 rounded-xl text-center">
						<p className="text-gray-400 text-sm uppercase">Draws</p>
						<p className="text-3xl font-bold text-yellow-400">{user?.score?.draws || 0}</p>
					</div>
					<div className="bg-white/5 p-4 rounded-xl text-center border border-board-focus/30">
						<p className="text-board-focus text-sm uppercase">Elo</p>
						<p className="text-3xl font-bold text-white">{user?.score?.elo || 1000}</p>
					</div>
				</section>
			</div>
		</main>
	);
}
