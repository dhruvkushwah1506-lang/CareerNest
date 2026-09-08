import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Button } from './ui/button'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42k-1lakh", "1lakh-5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

    return (
        <div className='w-full bg-card p-6 rounded-2xl border border-border/50 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-semibold text-lg tracking-tight'>Filter Jobs</h1>
                {selectedValue && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedValue('')}
                        className="h-8 px-2 text-xs text-primary hover:bg-primary/5 rounded-md"
                    >
                        Clear Filter
                    </Button>
                )}
            </div>
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={index} className='mb-6 last:mb-0'>
                            <h2 className='font-medium text-sm text-foreground/80 mb-3 uppercase tracking-wider text-[10px]'>{data.filterType}</h2>
                            <div className='space-y-2.5'>
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-3 group cursor-pointer'>
                                                <RadioGroupItem value={item} id={itemId} className="border-muted-foreground/30 text-primary focus-visible:ring-primary h-4 w-4" />
                                                <Label htmlFor={itemId} className="text-sm font-light text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard
