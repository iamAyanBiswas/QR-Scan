'use client'
import React from 'react';
import { Mail, Phone, Globe, Linkedin, Twitter, Instagram, MapPin, User, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RendererButton } from '@/components/renderer/ui/button';

export default function BusinessCardTemplate({ data }: { data: BusinessCardData }) {
    const theme = data.themeColor || '#f41515'

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100" style={{ "--custom-theme": theme } as React.CSSProperties}>
            <div className="w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">

                {/* Header / Banner */}
                <div
                    className="h-32 w-full relative"
                    style={{ backgroundColor: data.themeColor || '#000' }}
                >
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 p-1 bg-whit rounded-full">
                        <Avatar className="w-24 h-24 border-4 border-white">
                            <AvatarImage src={data.avatar} className="object-cover" />
                            <AvatarFallback>{data.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-6 text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">{data.fullName}</h1>
                    <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">{data.title}</p>
                    <p className="text-sm text-gray-500 font-medium">{data.company}</p>

                    {data.bio && (
                        <p className="text-sm text-gray-600 mt-4 leading-relaxed px-2">
                            {data.bio}
                        </p>
                    )}
                </div>

                {/* Contact Links */}
                <div className="px-6 pb-8 space-y-4">
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {data.email && (
                            <a href={`mailto:${data.email}`} className="flex items-center justify-center w-full aspect-square rounded-2xl bg-custom-theme/5 text-gray-700 hover:bg-custom-theme/15 hover:text-black transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                        {data.phone && (
                            <a href={`tel:${data.phone}`} className="flex items-center justify-center w-full aspect-square rounded-2xl bg-custom-theme/5 text-gray-700 hover:bg-custom-theme/15 hover:text-black transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        )}
                        {data.website && (
                            <a href={data.website} target="_blank" className="flex items-center justify-center w-full aspect-square rounded-2xl bg-custom-theme/5 text-gray-700 hover:bg-custom-theme/15 hover:text-black transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                        {data.address && (
                            <a href={`https://maps.google.com/?q=${data.address}`} target="_blank" className="flex items-center justify-center w-full aspect-square rounded-2xl bg-custom-theme/5 text-gray-700 hover:bg-custom-theme/15 hover:text-black transition-colors">
                                <MapPin className="w-5 h-5" />
                            </a>
                        )}
                    </div>

                    {/* Socials */}
                    <div className="flex justify-center gap-4 text-gray-400">
                        {data.linkedin && <a href={data.linkedin} target="_blank" className="text-[#0077b5]"><Linkedin className="w-5 h-5" /></a>}
                        {data.twitter && <a href={data.twitter} target="_blank" className="text-[#1DA1F2]"><Twitter className="w-5 h-5" /></a>}
                        {data.instagram && <a href={data.instagram} target="_blank" className="text-[#E1306C]"><Instagram className="w-5 h-5" /></a>}
                    </div>

                    <RendererButton
                        onClick={handleSaveContact}
                        className="w-full h-12 rounded-xl text-base shadow-lg"
                        style={{ backgroundColor: data.themeColor || undefined }}
                    >
                        <Download className="w-4 h-4 mr-2" /> Save Contact
                    </RendererButton>
                </div>
            </div>
        </div>
    );
}
