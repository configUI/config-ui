import { SelectItem } from "primeng/primeng";

export class ViewAdvanceSettings{
        sourcePath: string = "";
        agentMode: string = "";
        timeout: number = 10;
        compressedMode: any = 0;
        executeForcefully: any = 0;
        osType: string = "";
        installationDir = "";
        destPath: string = "/tmp";

}

export class InputFields{
        /** variables to be send with the message */
        tier: string = "";
        server: string = "";
        instance: string = "";
        fileType: string = "";
        sourcePath: string = "";
        agentMode: string = "";
        timeout: any = "";
        compressedMode: any = 0;
        executeForcefully: any = 0;
   }