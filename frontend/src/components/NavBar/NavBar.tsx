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
				"relative bg-board-nav-bg after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-emerald-600 after:via-emerald-400 after:to-emerald-600",
			)}>
			<div className="mx-auto w-full px-1 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
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
						<a href="/">
							<div className="flex shrink-0 items-center select-none text-board-nav-text">
								<span className="text-3xl leading-none">♞</span>
								<span className="ml-2 font-bold tracking-widest hidden sm:block">42 TRANScendence</span>
							</div>
						</a>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{navigation.map((item) => {
									if (item.name === "Login") {
										return (
											<button
												key={item.name}
												type="button"
												onClick={onOpenLogin}
												className="text-board-nav-text hover:text-white border border-board-dark hover:border-board-nav-text hover:bg-board-dark rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer transition-all">
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
												className="text-board-text font-semibold text-sm rounded-lg px-3 py-1.5 bg-board-input hover:bg-white border border-board-input cursor-pointer transition-colors">
												{item.name}
											</button>
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
							className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
							<span className="absolute -inset-1.5" />
							<span className="sr-only">View notifications</span>
							<BellIcon
								aria-hidden="true"
								className="size-6"
							/>
						</button>

						{/* Profile dropdown */}
						<Menu
							as="div"
							className="relative ml-3">
							<MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								<span className="absolute -inset-1.5" />
								<span className="sr-only">Open user menu</span>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
								/>
							</MenuButton>

							<MenuItems
								transition
								className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-neutral-900 py-1 border border-white/10 shadow-xl transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in overflow-hidden">
								<MenuItem>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden">
										Your profile
									</a>
								</MenuItem>
								<MenuItem>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden">
										Settings
									</a>
								</MenuItem>
								<MenuItem>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden">
										Sign out
									</a>
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{navigation.map((item) => (
						<DisclosureButton
							key={item.name}
							as="a"
							href={item.href}
							aria-current={item.current ? "page" : undefined}
							className={classNames(
								item.current
									? "bg-gray-950/50 text-white"
									: "text-gray-300 hover:bg-white/5 hover:text-white",
								"block rounded-md px-3 py-2 text-base font-medium",
							)}>
							{item.name}
						</DisclosureButton>
					))}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
