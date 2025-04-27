import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface DesktopFilterBarProps {
  totalCount: number;
  sort: string;
  setSort: (sort: string) => void;
}

const DesktopFilterBar: React.FC<DesktopFilterBarProps> = ({ 
  totalCount, 
  sort, 
  setSort 
}) => {
  return (
    <div className="hidden lg:flex justify-between items-center bg-white shadow rounded-lg mb-6 px-4 py-3">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-neutral-900">Legal Terms</h2>
        <span className="ml-2 text-sm text-neutral-500">
          (Showing {totalCount > 0 ? '1 - ' + Math.min(totalCount, 12) : '0'} of {totalCount})
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name_asc">A to Z</SelectItem>
                <SelectItem value="name_desc">Z to A</SelectItem>
                <SelectItem value="date_desc">Recently Added</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="inline-flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default DesktopFilterBar;
