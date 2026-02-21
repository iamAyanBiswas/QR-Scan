
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ticket, Briefcase, Trash2, Image as ImageIcon, Utensils, Calendar, Megaphone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QR_PAGE_TITLE } from "@/config/qr-page-builder";

interface PageBuilderFormProps {
    type: QrPageType
    data: any;
    onChange: (data: any) => void;
}




export function PageBuilderForm({ type, data, onChange }: PageBuilderFormProps) {

    const handleChange = (key: string, value: string) => {
        onChange({ ...data, [key]: value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                handleChange(key, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div key={type} className="space-y-4">
            <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
                {type === "couponPage" && <Ticket className="w-5 h-5 text-primary" />}
                {type === "businessCard" && <Briefcase className="w-5 h-5 text-primary" />}
                {type === "menuCard" && <Utensils className="w-5 h-5 text-primary" />}
                {type === "eventPage" && <Calendar className="w-5 h-5 text-primary" />}
                {type === "marketingPage" && <Megaphone className="w-5 h-5 text-primary" />}
                {type === "textPage" && <FileText className="w-5 h-5 text-primary" />}
                <h3 className="font-semibold text-sm">
                    {QR_PAGE_TITLE[type] ?? "Unknown Page"}
                </h3>
            </div>

            {type === "couponPage" ? (

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Campaign Title</Label>
                        <Input value={data.title ?? ""} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Discount Code</Label>
                            <Input value={data.discountCode ?? ""} onChange={(e) => handleChange("discountCode", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Value Label</Label>
                            <Input value={data.discountValue ?? ""} onChange={(e) => handleChange("discountValue", e.target.value)} placeholder="50% OFF" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={data.description ?? ""} onChange={(e) => handleChange("description", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input type="date" value={data.expiryDate ?? ""} onChange={(e) => handleChange("expiryDate", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Hero Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1" value={data.themeColor || "#ec4899"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Website URL</Label>
                        <Input value={data.websiteUrl ?? ""} onChange={(e) => handleChange("websiteUrl", e.target.value)} placeholder="https://..." />
                    </div>
                </div>
            ) : type === "businessCard" ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Avatar</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={data.fullName ?? ""} onChange={(e) => handleChange("fullName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input value={data.title ?? ""} onChange={(e) => handleChange("title", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={data.company ?? ""} onChange={(e) => handleChange("company", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea value={data.bio ?? ""} onChange={(e) => handleChange("bio", e.target.value)} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={data.email ?? ""} onChange={(e) => handleChange("email", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={data.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Twiter</Label>
                            <Input value={data.twitter ?? ""} onChange={(e) => handleChange("twitter", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Linkedin</Label>
                            <Input value={data.linkedin ?? ""} onChange={(e) => handleChange("linkedin", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram</Label>
                            <Input value={data.instagram ?? ""} onChange={(e) => handleChange("instagram", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input value={data.address ?? ""} onChange={(e) => handleChange("address", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1" value={data.themeColor ?? "#000000"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                        </div>
                    </div>
                </div>
            ) : type === "menuCard" ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Restaurant Name</Label>
                            <Input value={data.restaurantName || ""} onChange={(e) => handleChange("restaurantName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency Symbol</Label>
                            <Input value={data.currency || "$"} onChange={(e) => handleChange("currency", e.target.value)} className="w-20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1" value={data.themeColor ?? "#ea580c"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg">Menu Sections</Label>
                            <Button size="sm" variant="outline" onClick={() => {
                                const newSections = [...(data.sections || []), { title: "New Section", items: [] }];
                                handleChange("sections", newSections as any);
                            }}>+ Add Section</Button>
                        </div>

                        {(data.sections || []).map((section: any, sIdx: number) => (
                            <div key={sIdx} className="border rounded-lg p-4 bg-muted/20 space-y-4">
                                <div className="flex gap-4 items-center">
                                    <Input value={section.title ?? ""} onChange={(e) => {
                                        const newSections = [...data.sections];
                                        newSections[sIdx].title = e.target.value;
                                        handleChange("sections", newSections as any);
                                    }} className="font-bold" placeholder="Section Title (e.g. Starters)" />
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        const newSections = data.sections.filter((_: any, i: number) => i !== sIdx);
                                        handleChange("sections", newSections as any);
                                    }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </div>

                                <div className="space-y-2 pl-4 border-l-2">
                                    {(section.items || []).map((item: any, iIdx: number) => (
                                        <div key={iIdx} className="grid grid-cols-12 gap-2 items-start">
                                            <div className="col-span-4">
                                                <Input placeholder="Item Name" value={item.name ?? ""} onChange={(e) => {
                                                    const newSections = [...data.sections];
                                                    newSections[sIdx].items[iIdx].name = e.target.value;
                                                    handleChange("sections", newSections as any);
                                                }} />
                                            </div>
                                            <div className="col-span-2">
                                                <Input placeholder="Price" value={item.price ?? ""} onChange={(e) => {
                                                    const newSections = [...data.sections];
                                                    newSections[sIdx].items[iIdx].price = e.target.value;
                                                    handleChange("sections", newSections as any);
                                                }} />
                                            </div>
                                            <div className="col-span-5">
                                                <Input placeholder="Description" value={item.description ?? ""} onChange={(e) => {
                                                    const newSections = [...data.sections];
                                                    newSections[sIdx].items[iIdx].description = e.target.value;
                                                    handleChange("sections", newSections as any);
                                                }} />
                                            </div>
                                            <Button variant="ghost" size="icon" className="col-span-1" onClick={() => {
                                                const newSections = [...data.sections];
                                                newSections[sIdx].items = newSections[sIdx].items.filter((_: any, i: number) => i !== iIdx);
                                                handleChange("sections", newSections as any);
                                            }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                                        </div>
                                    ))}
                                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => {
                                        const newSections = [...data.sections];
                                        newSections[sIdx].items.push({ name: "", price: "", description: "" });
                                        handleChange("sections", newSections as any);
                                    }}>+ Add Item</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : type === "eventPage" ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Event Title</Label>
                        <Input value={data.title || ""} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start</Label>
                            <Input type="datetime-local" value={data.startDate || ""} onChange={(e) => handleChange("startDate", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>End</Label>
                            <Input type="datetime-local" value={data.endDate || ""} onChange={(e) => handleChange("endDate", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={data.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Hero Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={data.description || ""} onChange={(e) => handleChange("description", e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1" value={data.themeColor ?? "#2563eb"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <Label>Agenda / Schedule</Label>
                            <Button size="sm" variant="outline" onClick={() => {
                                const newAgenda = [...(data.agenda || []), { time: "", activity: "" }];
                                handleChange("agenda", newAgenda as any);
                            }}>+ Add Slot</Button>
                        </div>
                        {(data.agenda || []).map((slot: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input type="time" className="w-32" value={slot.time ?? ""} onChange={(e) => {
                                    const newAgenda = [...data.agenda];
                                    newAgenda[idx].time = e.target.value;
                                    handleChange("agenda", newAgenda as any);
                                }} />
                                <Input className="flex-1" placeholder="Activity" value={slot.activity ?? ""} onChange={(e) => {
                                    const newAgenda = [...data.agenda];
                                    newAgenda[idx].activity = e.target.value;
                                    handleChange("agenda", newAgenda as any);
                                }} />
                                <Button variant="ghost" size="icon" onClick={() => {
                                    const newAgenda = data.agenda.filter((_: any, i: number) => i !== idx);
                                    handleChange("agenda", newAgenda as any);
                                }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : type === "marketingPage" ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input value={data.headline || ""} onChange={(e) => handleChange("headline", e.target.value)} placeholder="Big Catchy Title" />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheadline</Label>
                        <Input value={data.subheadline || ""} onChange={(e) => handleChange("subheadline", e.target.value)} placeholder="Supporting text" />
                    </div>
                    <div className="space-y-2">
                        <Label>Hero Image</Label>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Body Text</Label>
                        <Textarea value={data.bodyText || ""} onChange={(e) => handleChange("bodyText", e.target.value)} rows={5} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input value={data.ctaIdentifier || ""} onChange={(e) => handleChange("ctaIdentifier", e.target.value)} placeholder="Sign Up Now" />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA URL</Label>
                            <Input value={data.ctaUrl || ""} onChange={(e) => handleChange("ctaUrl", e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-10 p-1" value={data.themeColor || "#7c3aed"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            <Input value={data.themeColor || ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                        </div>
                    </div>
                </div>
            ) : type === "textPage" ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title (Optional)</Label>
                        <Input value={data.title || ""} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Content (HTML Supported)</Label>
                        <Textarea className="font-mono text-sm" value={data.content || ""} onChange={(e) => handleChange("content", e.target.value)} rows={15} placeholder="<p>Write your content here...</p>" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Background Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-10 p-1" value={data.backgroundColor || "#ffffff"} onChange={(e) => handleChange("backgroundColor", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Text Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-10 p-1" value={data.textColor || "#000000"} onChange={(e) => handleChange("textColor", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
