import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { CategoryController } from "./controllers/category.controller";
import { ServiceController } from "./controllers/service.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports:[PrismaModule],
    providers:[ServicesService],
    controllers:[CategoryController,ServiceController],
    exports:[ServicesService]
})
export class ServiceModule{}
