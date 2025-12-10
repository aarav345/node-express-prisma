import { Router, Request, Response } from "express";
import {prisma} from "../lib/prisma";

const router = Router();


router.post('/', async (req: Request, res: Response) => {
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
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ 
            error: 'Failed to create user',
            details: error.message 
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
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
        res.status(500).json({ 
        error: 'Failed to fetch users',
        details: error.message 
        });
    }
});


router.get('/:id', async (req: Request, res: Response) => {
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
        res.status(500).json({
            error: 'Failed to get user',
            details: error.message
        });
    }
});


router.put('/:id', async (req: Request, res: Response) => {
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
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({
            error: 'Failed to update user',
            details: error.message
        });
    }
})


router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(500).json({
            error: 'Failed to delete user',
            details: error.message
        });
    }
});


export default router;