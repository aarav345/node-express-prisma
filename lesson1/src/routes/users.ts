import { Router, Request, Response, NextFunction } from "express";
import {prisma} from "../lib/prisma";

const router = Router();


router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password // hash this in production
            }
        });
        res.status(201).json(user);


    } catch (error: any) {
        next(error);    
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            isActive: true,
            createdAt: true,
            // Exclude password from response
        },
        });

        res.json(users);
    } catch (error: any) {
        next(error);
    }
});

router.get('/active-users', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const days = new Date();
        days.setDate(days.getDate() - 30);
        
        const users = await prisma.user.findMany({
            where: { isActive: true, createdAt: { gt: days } },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json(users);
    } catch (error: any) {
        next(error);
    }
})


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch(error: any) {
        next(error);
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email, isActive } = req.body;

        const user = await prisma.user.update({
            where:  { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(isActive !== undefined && { isActive })
            },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                updatedAt: true,
            }
        })

        res.status(200).json(user);
    } catch (error: any) {
        next(error);
    }
})


router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
});




export default router;