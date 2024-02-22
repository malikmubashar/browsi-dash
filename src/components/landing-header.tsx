import { AccountTreeRounded } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="flex justify-end p-3 w-full absolute top-0">
      <div className="px-2">
        <Tooltip title="Apps DataSheet" arrow placement='left' >
          <Link href="/datasheet">
            <AccountTreeRounded className="p-1.5 scale-150 rounded-lg pointer bg-cl/10 transition-all  active:scale-125 text-cl/80" />
          </Link>
        </Tooltip>
      </div>
    </header>
  )
}
