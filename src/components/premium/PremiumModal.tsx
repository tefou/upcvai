"use client";

import usePremiumModal from "@/hooks/usePremiumModal";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCheckoutSession } from "./actions";


const premiumFeatures = ["Hỗ trợ AI", "Được tạo thêm 1 CV","Cá Nhân Hóa CV"]
export default function PremiumModal(){


    const {open, setOpen} = usePremiumModal()


    const [loading, setLoading] = useState(false)

    async function handlePremiumClick() {
        setLoading(true)
        const redirectUrl = await createCheckoutSession ()
        window.location.href = redirectUrl
    }

    return <Dialog open = {open} onOpenChange={(open) => {
        if(!loading){
            setOpen(open)
        }
    }}>
        <DialogContent className="max-w-2xl bg-black  border-yellow-600 text-yellow-600">
            <DialogHeader>
                <DialogTitle className="text-lg">
                    Premium
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-yellow-400">
                <p>
                    Trải nghiệm nhiều tính năng hữu ích hơn với gói Premium
                </p>
                <div className="flex">
                    <div className="flex w-full flex-col space-y-5 text-yellow-600">
                        <ul>
                        {premiumFeatures.map(feature => (
                            <li key={feature} className="flex items-center justify-center gap-2 align-middle list-inside">
                                <Check className="size-4 text-yellow-600 text-center"/>
                                {feature}
                            </li>
                        ))}
                        </ul>
                        <Button onClick={()=>handlePremiumClick()} disabled={loading} 
                        className="text-black bg-yellow-600 hover:bg-yellow-100 hover:text-yellow-600">Nâng Cấp</Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}