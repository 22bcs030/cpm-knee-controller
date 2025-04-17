"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MovementGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ankle Movement Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dorsiflexion">
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="dorsiflexion">Dorsiflexion</TabsTrigger>
            <TabsTrigger value="plantarflexion">Plantar flexion</TabsTrigger>
            <TabsTrigger value="inversion">Inversion</TabsTrigger>
            <TabsTrigger value="eversion">Eversion</TabsTrigger>
            <TabsTrigger value="abduction">Abduction</TabsTrigger>
            <TabsTrigger value="adduction">Adduction</TabsTrigger>
          </TabsList>

          <TabsContent value="dorsiflexion" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Dorsiflexion (0° to -30°)</h3>
                <p className="text-sm text-muted-foreground">
                  Dorsiflexion is the movement that decreases the angle between the top of the foot and the shin. It&apos;s
                  the motion of bringing the toes up toward the shin.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Pitch axis</li>
                  <li>Safe range: 0° to -30°</li>
                  <li>Used in: Walking, climbing stairs</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14 transform -rotate-45"></div>
                  <div className="absolute w-4 h-20 bg-primary/20 rounded-md left-14 top-6"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform rotate-[15deg] origin-left"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Dorsiflexion</div>
                  <div className="absolute right-0 top-0 text-xs">-30°</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plantarflexion" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Plantar flexion (0° to 40°)</h3>
                <p className="text-sm text-muted-foreground">
                  Plantar flexion is the movement that increases the angle between the top of the foot and the shin.
                  It&apos;s the motion of pointing the toes downward.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Pitch axis</li>
                  <li>Safe range: 0° to 40°</li>
                  <li>Used in: Walking, running, jumping</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14 transform -rotate-45"></div>
                  <div className="absolute w-4 h-20 bg-primary/20 rounded-md left-14 top-6"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform rotate-[-60deg] origin-left"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Plantar flexion</div>
                  <div className="absolute right-0 bottom-0 text-xs">40°</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inversion" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Inversion (0° to -30°)</h3>
                <p className="text-sm text-muted-foreground">
                  Inversion is the movement of turning the sole of the foot inward, toward the midline of the body.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Roll axis</li>
                  <li>Safe range: 0° to -30°</li>
                  <li>Used in: Balancing, walking on uneven surfaces</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform rotate-[30deg]"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Inversion</div>
                  <div className="absolute right-0 bottom-0 text-xs">-30°</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eversion" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Eversion (0° to 20°)</h3>
                <p className="text-sm text-muted-foreground">
                  Eversion is the movement of turning the sole of the foot outward, away from the midline of the body.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Roll axis</li>
                  <li>Safe range: 0° to 20°</li>
                  <li>Used in: Balancing, walking on uneven surfaces</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform rotate-[-20deg]"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Eversion</div>
                  <div className="absolute right-0 bottom-0 text-xs">20°</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="abduction" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Abduction (0° to -30°)</h3>
                <p className="text-sm text-muted-foreground">
                  Abduction is the movement of the foot away from the midline of the body.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Yaw axis</li>
                  <li>Safe range: 0° to -30°</li>
                  <li>Used in: Changing direction while walking or running</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform translate-x-[-5px] rotate-[-30deg] origin-center"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Abduction</div>
                  <div className="absolute right-0 bottom-0 text-xs">-30°</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adduction" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Adduction (0° to 20°)</h3>
                <p className="text-sm text-muted-foreground">
                  Adduction is the movement of the foot toward the midline of the body.
                </p>
                <ul className="mt-2 text-sm list-disc list-inside">
                  <li>Controlled by the Yaw axis</li>
                  <li>Safe range: 0° to 20°</li>
                  <li>Used in: Changing direction while walking or running</li>
                </ul>
              </div>
              <div className="bg-muted rounded-md flex items-center justify-center p-4">
                <div className="relative w-32 h-32">
                  <div className="absolute w-20 h-4 bg-primary/20 rounded-md left-6 top-14"></div>
                  <div className="absolute w-20 h-4 bg-primary rounded-md left-6 top-14 transform translate-x-[5px] rotate-[20deg] origin-center"></div>
                  <div className="absolute left-0 bottom-0 text-xs">Adduction</div>
                  <div className="absolute right-0 bottom-0 text-xs">20°</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
