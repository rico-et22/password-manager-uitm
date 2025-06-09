import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export function PasswordCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>Password name</CardHeader>
      <CardContent>202020</CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Copy Password
        </Button>
        <Button variant="outline" className="w-full">
          Edit
        </Button>
        <Button variant="destructive" className="w-full">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
