"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart } from "lucide-react"

interface UtmUrlInputProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
}

export function UtmUrlInput({ value: propValue, onChange, placeholder = "https://example.com" }: UtmUrlInputProps) {
    const [internalValue, setInternalValue] = useState(propValue || "")
    const [isOpen, setIsOpen] = useState(false)

    // UTM specific states
    const [utmSource, setUtmSource] = useState("")
    const [utmMedium, setUtmMedium] = useState("")
    const [utmCampaign, setUtmCampaign] = useState("")

    // Sync internal state with prop if controlled
    useEffect(() => {
        if (propValue !== undefined) {
            setInternalValue(propValue)
        }
    }, [propValue])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInternalValue(newValue)
        onChange?.(newValue)
    }

    // Parse URL when dialog opens
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open && internalValue) {
            try {
                // Handle partial URLs by validating or assuming https if protocol missing for parsing
                let urlStringToParse = internalValue
                if (!urlStringToParse.startsWith("http://") && !urlStringToParse.startsWith("https://")) {
                    // If it's just a domain or path, parsing might fail or return wrong protocol. 
                    // For UTM extraction, we can try to prepend https:// placeholder if valid domain structure
                    urlStringToParse = "https://" + urlStringToParse
                }

                const urlObj = new URL(urlStringToParse)
                const params = urlObj.searchParams

                setUtmSource(params.get("utm_source") || "")
                setUtmMedium(params.get("utm_medium") || "")
                setUtmCampaign(params.get("utm_campaign") || "")
            } catch (e) {
                // Invalid URL or empty, reset fields
                setUtmSource("")
                setUtmMedium("")
                setUtmCampaign("")
            }
        }
    }

    const handleSaveUtm = () => {
        try {
            let urlString = internalValue
            if (!urlString) return // Or handle empty URL case

            // Helper to ensure we have a valid URL object
            let tempUrlObj: URL
            let needsProtocolPrepend = false

            if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
                tempUrlObj = new URL("https://" + urlString)
                needsProtocolPrepend = true
            } else {
                tempUrlObj = new URL(urlString)
            }

            const params = tempUrlObj.searchParams

            // Update params
            if (utmSource) params.set("utm_source", utmSource)
            else params.delete("utm_source")

            if (utmMedium) params.set("utm_medium", utmMedium)
            else params.delete("utm_medium")

            if (utmCampaign) params.set("utm_campaign", utmCampaign)
            else params.delete("utm_campaign")

            // Convert back to string
            let finalUrl = tempUrlObj.toString()

            // If we prepended protocol just for parsing and original didn't have it, 
            // we might want to remove it? Or just keep it as valid URL?
            // Usually better to keep a valid URL. But if user typed "google.com", 
            // turning it into "https://google.com?utm..." is probably desired behavior.
            // However, typical URL inputs might want specific formatting. 
            // Let's assume standard behavior is returning fully qualified URL.
            // But if unnecessary slash at end etc, URL object adds it. 
            // Let's stick to the URL object's toString().

            setInternalValue(finalUrl)
            onChange?.(finalUrl)
            setIsOpen(false)
        } catch (e) {
            console.error("Failed to construct URL with UTM params", e)
            // Optional: show error toast
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <div className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                    <Input
                        id="website-url"
                        value={internalValue}
                        onChange={handleUrlChange}
                        placeholder={placeholder}
                        className="pr-10" // Make room for an icon if we wanted, or just standard
                    />
                </div>

                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="shrink-0">
                            <BarChart />
                            UTM
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>UTM Parameters</DialogTitle>
                            <DialogDescription>
                                Add tracking parameters to your URL. Leave blank to remove.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="utm_source" className="text-right">
                                    Source
                                </Label>
                                <Input
                                    id="utm_source"
                                    value={utmSource}
                                    onChange={(e) => setUtmSource(e.target.value)}
                                    placeholder="google, newsletter"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="utm_medium" className="text-right">
                                    Medium
                                </Label>
                                <Input
                                    id="utm_medium"
                                    value={utmMedium}
                                    onChange={(e) => setUtmMedium(e.target.value)}
                                    placeholder="cpc, banner"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="utm_campaign" className="text-right">
                                    Campaign
                                </Label>
                                <Input
                                    id="utm_campaign"
                                    value={utmCampaign}
                                    onChange={(e) => setUtmCampaign(e.target.value)}
                                    placeholder="summer_sale"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSaveUtm}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}