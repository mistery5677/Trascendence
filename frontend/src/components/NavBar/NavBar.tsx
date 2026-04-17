import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
	// { name: "Home", href: "/", current: true },
	{ name: "Login", href: "/login", current: false },
	{ name: "Register", href: "/signup", current: false },
	{ name: "Play", href: "/play", current: false },
];

function classNames(...classes: (string | undefined | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

interface NavBarProps {
	onOpenSignup?: () => void;
	onOpenLogin?: () => void;
}

export function NavBar({ onOpenSignup, onOpenLogin }: NavBarProps) {
	return (
		<Disclosure
			as="nav"
			className={classNames(
				"relative z-50 bg-linear-to-r from-slate-950/95 via-stone-950/95 to-slate-950/95 backdrop-blur-md shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)] border-b border-emerald-300/15",
			)}>
			<div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="relative flex h-18 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-xl p-2 text-stone-300 hover:bg-emerald-400/12 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon
								aria-hidden="true"
								className="block size-6 group-data-open:hidden"
							/>
							<XMarkIcon
								aria-hidden="true"
								className="hidden size-6 group-data-open:block"
							/>
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<a
							href="/"
							className="flex items-center group transition-transform hover:scale-105 active:scale-95 duration-200">
							<div className="flex shrink-0 items-center select-none text-stone-200 bg-stone-900/80 rounded-xl p-2 border border-stone-700">
								<span className="text-4xl leading-none">♞</span>
							</div>
							<span className="ml-3 font-semibold tracking-tight text-xl text-stone-100 hidden sm:block">
								42 <span className="text-emerald-200">Transcendence</span>
							</span>
						</a>
						<div className="hidden sm:ml-auto sm:flex sm:items-center">
							<div className="flex space-x-2 items-center rounded-full bg-stone-900/40 border border-emerald-300/10 p-1.5">
								{navigation.map((item) => {
									if (item.name === "Login") {
										return (
											<button
												key={item.name}
												type="button"
												onClick={onOpenLogin}
												className="text-stone-300 hover:text-stone-100 hover:bg-stone-800/70 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 border border-transparent hover:border-stone-600/60">
												{item.name}
											</button>
										);
									}

									if (item.name === "Register") {
										return (
											<button
												key={item.name}
												type="button"
												onClick={onOpenSignup}
												className="text-emerald-100 bg-emerald-500/18 hover:bg-emerald-500/28 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 border border-emerald-300/35 hover:border-emerald-300/55">
												{item.name}
											</button>
										);
									}

									if (item.name === "Play") {
										return (
											<div
												key={item.name}
												className="relative ml-1 group/play">
												<a
													href="/play"
													className="block rounded-2xl border border-lime-100/90 bg-linear-to-r from-lime-300 to-emerald-300 px-6 py-2 text-sm font-black tracking-wide text-slate-950 shadow-[0_10px_20px_-12px_rgba(132,204,22,0.9)] transition-all duration-200 hover:from-lime-200 hover:to-emerald-200 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
													Play
												</a>

												<div className="pointer-events-none invisible absolute right-0 top-full z-20 w-56 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover/play:pointer-events-auto group-hover/play:visible group-hover/play:translate-y-0 group-hover/play:opacity-100 group-focus-within/play:pointer-events-auto group-focus-within/play:visible group-focus-within/play:translate-y-0 group-focus-within/play:opacity-100">
													<div className="rounded-2xl border border-emerald-300/20 bg-slate-900/95 p-2 shadow-[0_16px_30px_-14px_rgba(0,0,0,0.85)] backdrop-blur-md">
														<a
															href="/play?mode=bot"
															className="block rounded-xl px-4 py-3 text-sm font-semibold text-stone-200 transition-colors hover:bg-emerald-400/12 hover:text-emerald-100 align-middle">
															Against <span className="text-2xl"> 🤖</span>
														</a>
														<a
															href="/play?mode=online"
															className="mt-1 block rounded-xl px-4 py-3 text-sm font-semibold text-stone-200 transition-colors hover:bg-emerald-400/12 hover:text-emerald-100 align-middle">
															Online
															<span className="text-3xl"> ♞</span>
														</a>
													</div>
												</div>
											</div>
										);
									}

									return (
										<a
											key={item.name}
											href={item.href}
											aria-current={item.current ? "page" : undefined}
											className={classNames(
												item.current
													? "bg-gray-950/50 text-white"
													: "text-gray-300 hover:bg-white/5 hover:text-white",
												"rounded-md px-3 py-2 text-sm font-medium",
											)}>
											{item.name}
										</a>
									);
								})}
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<button
							type="button"
							className="relative rounded-xl p-2 text-stone-300 hover:text-emerald-200 hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 hover:scale-[1.03] active:scale-95">
							<span className="absolute -inset-1.5" />
							<span className="sr-only">View notifications</span>
							<BellIcon
								aria-hidden="true"
								className="size-6"
							/>
							<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime-300" />
						</button>

						{/* Profile dropdown */}
						<Menu
							as="div"
							className="relative ml-4">
							<MenuButton className="relative flex rounded-full ring-2 ring-emerald-300/40 hover:ring-emerald-300/70 transition-all duration-200 focus:outline-none focus:ring-emerald-400 hover:scale-[1.03] active:scale-95 shadow-sm">
								<span className="absolute -inset-1.5" />
								<span className="sr-only">Open user menu</span>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="size-10 rounded-full bg-slate-800 object-cover"
								/>
							</MenuButton>

							<MenuItems
								transition
								className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-2xl bg-slate-900/95 py-2 border border-emerald-300/20 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.8)] transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in overflow-hidden">
								<MenuItem>
									<a
										href="/profile"
										className="block px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-emerald-400/12 hover:text-stone-100 transition-colors">
										Your Profile
									</a>
								</MenuItem>
								<MenuItem>
									<a
										href="/settings"
										className="block px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-emerald-400/12 hover:text-stone-100 transition-colors">
										Settings
									</a>
								</MenuItem>
								<MenuItem>
									<a
										href="/logout"
										className="block px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
										Sign out
									</a>
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden border-t border-emerald-300/15 bg-slate-950/95">
				<div className="space-y-2 px-4 pt-3 pb-4">
					{navigation.map((item) => (
						<DisclosureButton
							key={item.name}
							as="a"
							href={item.href}
							aria-current={item.current ? "page" : undefined}
							className={classNames(
								item.current
									? "bg-emerald-400/15 text-stone-100"
									: "text-stone-300 hover:bg-emerald-400/12 hover:text-stone-100",
								"block rounded-xl px-4 py-3 text-base font-bold transition-all",
							)}>
							{item.name}
						</DisclosureButton>
					))}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
