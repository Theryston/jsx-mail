import React from "react";
import { HelloComponent } from "../../components/HelloComponent";

export function Welcome({ prefix }: { prefix: string }) {
  return (
    <div>
      {prefix}
      <HelloComponent text="Welcome" />
    </div>
  );
}
