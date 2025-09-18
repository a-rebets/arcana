import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChecksIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import {
	Tabs,
	TabsContent,
	TabsContents,
	useTabs,
} from "@/components/animate-ui/primitives/radix/tabs";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";

const tabs: { value: string; component: React.ComponentType }[] = [
	{
		value: "email",
		component: EmailTab,
	},
	{
		value: "otp",
		component: OtpTab,
	},
];

const dialogFormSchema = z.object({
	email: z.email(),
	code: z.string().min(6).optional(),
});

export const LoginDialog = ({ children }: { children: React.ReactNode }) => {
	const { signIn } = useAuthActions();

	const form = useForm<z.infer<typeof dialogFormSchema>>({
		resolver: zodResolver(dialogFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = useCallback(
		(data: z.infer<typeof dialogFormSchema>) => {
			const withCode = data.code !== undefined;
			void signIn("resend-otp", data)
				.then(() => {
					toast.success(withCode ? "Login successful" : "Email sent", {
						icon: withCode ? (
							<ChecksIcon weight="bold" className="size-full" />
						) : (
							<CheckIcon weight="bold" className="size-full" />
						),
					});
				})
				.catch(() => {
					toast.error("Failed to login", {
						icon: <XIcon weight="bold" className="size-full" />,
					});
				});
		},
		[signIn],
	);

	useEffect(() => {
		const unsubscribe = form.subscribe({
			name: "code",
			formState: {
				errors: true,
			},
			callback: (data) => {
				if (!data.errors?.code && data.values?.code) {
					onSubmit(data.values);
				}
			},
		});
		return () => unsubscribe();
	}, [form.subscribe, onSubmit]);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] min-h-52 p-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Tabs defaultValue="email">
							<TabsContents>
								{tabs.map((tab) => (
									<TabsContent
										key={tab.value}
										value={tab.value}
										className="p-2"
									>
										<tab.component />
									</TabsContent>
								))}
							</TabsContents>
						</Tabs>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

function EmailTab() {
	const { setValue: setTabValue } = useTabs();
	const { control, formState } =
		useFormContext<z.infer<typeof dialogFormSchema>>();

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			setTabValue?.("otp");
		}
	}, [formState.isSubmitSuccessful, setTabValue]);

	return (
		<div className="flex flex-col gap-6">
			<DialogHeader>
				<DialogTitle>Login to Arcana</DialogTitle>
				<DialogDescription>
					We'll send a one-time code to your email.
				</DialogDescription>
			</DialogHeader>
			<FormField
				control={control}
				name="email"
				render={({ field, fieldState }) => (
					<>
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="user@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" disabled={fieldState.invalid}>
								Submit
							</Button>
						</DialogFooter>
					</>
				)}
			/>
		</div>
	);
}

function OtpTab() {
	const { control } = useFormContext<z.infer<typeof dialogFormSchema>>();

	return (
		<div className="flex flex-col gap-6">
			<DialogHeader>
				<DialogTitle>Waiting for code</DialogTitle>
				<DialogDescription>
					Now please check your email and enter the code.
				</DialogDescription>
			</DialogHeader>
			<FormField
				control={control}
				name="code"
				render={({ field, fieldState }) => (
					<FormItem>
						<FormControl>
							<InputOTP
								maxLength={6}
								autoFocus
								containerClassName="justify-center pt-4"
								disabled={!fieldState.invalid && fieldState.isDirty}
								{...field}
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
								</InputOTPGroup>
								<InputOTPSeparator />
								<InputOTPGroup>
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
