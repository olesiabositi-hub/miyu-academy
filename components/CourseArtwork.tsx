type ArtworkSlot =
  | "why"
  | "decoder"
  | "module-01"
  | "module-02"
  | "module-03"
  | "module-04"
  | "module-05"
  | "module-06"
  | "module-07"
  | "module-08";

const SPRITE_WIDTH=1200;
const SPRITE_HEIGHT=1451;

const CROPS:Record<ArtworkSlot,{x:number;y:number;width:number;height:number}> = {
  why:{x:0,y:675,width:600,height:400},
  decoder:{x:600,y:675,width:600,height:400},
  "module-01":{x:0,y:1075,width:300,height:188},
  "module-02":{x:300,y:1075,width:300,height:188},
  "module-03":{x:600,y:1075,width:300,height:188},
  "module-04":{x:900,y:1075,width:300,height:188},
  "module-05":{x:0,y:1263,width:300,height:188},
  "module-06":{x:300,y:1263,width:300,height:188},
  "module-07":{x:600,y:1263,width:300,height:188},
  "module-08":{x:900,y:1263,width:300,height:188},
};

export function CourseArtwork({
  slot,
  className="",
  label,
}:{slot:ArtworkSlot;className?:string;label?:string}){
  const crop=CROPS[slot];
  return <svg
    className={`courseArtwork ${className}`}
    viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`}
    role={label?"img":undefined}
    aria-label={label}
    aria-hidden={label?undefined:true}
    preserveAspectRatio="xMidYMid slice"
  >
    <image
      href="/visuals/gm-course-sprite.webp"
      x="0"
      y="0"
      width={SPRITE_WIDTH}
      height={SPRITE_HEIGHT}
      preserveAspectRatio="none"
    />
  </svg>;
}
