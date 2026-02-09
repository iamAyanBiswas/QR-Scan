'use client'
import React from 'react';
import { Mail, Phone, Globe, Linkedin, Twitter, Instagram, MapPin, User, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BusinessCardTemplate({ data }: { data: BusinessCardData }) {

    const handleSaveContact = () => {
        // Simple vCard generation
        const vcard = `BEGIN:VCARD
VERSION:3.0
N:${data.fullName}
FN:${data.fullName}
ORG:${data.company}
TITLE:${data.title}
TEL;TYPE=WORK,VOICE:${data.phone}
EMAIL:${data.email}
URL:${data.website}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.fullName}.vcf`;
        a.click();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-zinc-950">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">

                {/* Header / Banner */}
                <div
                    className="h-32 w-full relative"
                    style={{ backgroundColor: data.themeColor || '#000' }}
                >
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 p-1 bg-white dark:bg-zinc-900 rounded-full">
                        <Avatar className="w-24 h-24 border-4 border-white dark:border-zinc-900">
                            <AvatarImage src={data.avatar} className="object-cover" />
                            <AvatarFallback>{data.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-6 text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.fullName}</h1>
                    <p className="text-sm font-medium text-primary uppercase tracking-wide">{data.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{data.company}</p>

                    {data.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed px-2">
                            {data.bio}
                        </p>
                    )}
                </div>

                {/* Contact Links */}
                <div className="px-6 pb-8 space-y-4">
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {data.email && (
                            <a href={`mailto:${data.email}`} className="flex items-center justify-center w-full aspect-square rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                        {data.phone && (
                            <a href={`tel:${data.phone}`} className="flex items-center justify-center w-full aspect-square rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        )}
                        {data.website && (
                            <a href={data.website} target="_blank" className="flex items-center justify-center w-full aspect-square rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                        {data.address && (
                            <a href={`https://maps.google.com/?q=${data.address}`} target="_blank" className="flex items-center justify-center w-full aspect-square rounded-2xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors">
                                <MapPin className="w-5 h-5" />
                            </a>
                        )}
                    </div>

                    {/* Socials */}
                    <div className="flex justify-center gap-4 text-gray-400">
                        {data.linkedin && <a href={data.linkedin} target="_blank" className="hover:text-[#0077b5] transition-colors"><Linkedin className="w-5 h-5" /></a>}
                        {data.twitter && <a href={data.twitter} target="_blank" className="hover:text-[#1DA1F2] transition-colors"><Twitter className="w-5 h-5" /></a>}
                        {data.instagram && <a href={data.instagram} target="_blank" className="hover:text-[#E1306C] transition-colors"><Instagram className="w-5 h-5" /></a>}
                    </div>

                    <Button
                        onClick={handleSaveContact}
                        className="w-full h-12 rounded-xl text-base shadow-lg"
                        style={{ backgroundColor: data.themeColor || undefined }}
                    >
                        <Download className="w-4 h-4 mr-2" /> Save Contact
                    </Button>
                </div>
            </div>
        </div>
    );
}
