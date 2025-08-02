"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', user_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/wallet', wallet_routes_1.default);
// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'The requested URL was not found on this server.'
    });
});
exports.default = app;
