"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServicioDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_servicio_dto_1 = require("./create-servicio.dto");
class UpdateServicioDto extends (0, mapped_types_1.PartialType)(create_servicio_dto_1.CreateServicioDto) {
}
exports.UpdateServicioDto = UpdateServicioDto;
//# sourceMappingURL=update-servicio.dto.js.map