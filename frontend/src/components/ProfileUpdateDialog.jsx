import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/lib/axios'
import { setAuthUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resume || ""
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const generateBioHandler = async () => {
        if (!input.skills) {
            toast.error("Add a few skills first so the AI has something to work with");
            return;
        }
        try {
            setAiLoading(true);
            const res = await api.post('/ai/generate-bio', {
                fullname: input.fullname,
                skills: input.skills,
                currentBio: input.bio
            });
            if (res.data?.success) {
                setInput(prev => ({ ...prev, bio: res.data.bio }));
                toast.success("Bio generated — tweak it if you'd like.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "AI generation failed. Please try again.");
        } finally {
            setAiLoading(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await api.post("/user/profile/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                toast.success(res.data.msg);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.msg);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            {user?.role !== 'Recruiter' && (
                                <>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="skills" className="text-right">Skills</Label>
                                        <Input
                                            id="skills"
                                            name="skills"
                                            value={input.skills}
                                            onChange={changeEventHandler}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <div />
                                        <button
                                            type="button"
                                            onClick={generateBioHandler}
                                            disabled={aiLoading}
                                            className="col-span-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 text-foreground transition-colors disabled:opacity-60 w-fit"
                                        >
                                            {aiLoading ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-3.5 w-3.5" />
                                            )}
                                            {aiLoading ? "Writing bio..." : "Generate bio with AI"}
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="file" className="text-right">Resume</Label>
                                        <Input
                                            id="file"
                                            name="file"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={fileChangeHandler}
                                            className="col-span-3"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
