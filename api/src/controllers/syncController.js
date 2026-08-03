const prisma = require('../prisma');

async function syncData(req, res) {
  try {
    const { householdId, lastSyncedAt, changes } = req.body;

    if (!householdId) {
      return res.status(400).json({ error: 'householdId es requerido' });
    }

    const lastSyncDate = lastSyncedAt ? new Date(lastSyncedAt) : new Date(0);

    // 1. Process client changes if any
    if (changes) {
      const { members = [], categories = [], transactions = [] } = changes;

      // Upsert Members
      for (const m of members) {
        await prisma.householdMember.upsert({
          where: { id: m.id },
          create: {
            id: m.id,
            householdId,
            name: m.name,
            avatar: m.avatar || null,
            color: m.color || null,
            isDeleted: Boolean(m.isDeleted),
            updatedAt: m.updatedAt ? new Date(m.updatedAt) : new Date()
          },
          update: {
            name: m.name,
            avatar: m.avatar || null,
            color: m.color || null,
            isDeleted: Boolean(m.isDeleted),
            updatedAt: m.updatedAt ? new Date(m.updatedAt) : new Date()
          }
        });
      }

      // Upsert Categories
      for (const c of categories) {
        await prisma.category.upsert({
          where: { id: c.id },
          create: {
            id: c.id,
            householdId,
            name: c.name,
            icon: c.icon || 'tag',
            type: c.type || 'EXPENSE',
            budgetLimit: c.budgetLimit !== undefined ? Number(c.budgetLimit) : 0,
            color: c.color || null,
            isDeleted: Boolean(c.isDeleted),
            updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date()
          },
          update: {
            name: c.name,
            icon: c.icon || 'tag',
            type: c.type || 'EXPENSE',
            budgetLimit: c.budgetLimit !== undefined ? Number(c.budgetLimit) : 0,
            color: c.color || null,
            isDeleted: Boolean(c.isDeleted),
            updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date()
          }
        });
      }

      // Upsert Transactions
      for (const t of transactions) {
        await prisma.transaction.upsert({
          where: { id: t.id },
          create: {
            id: t.id,
            householdId,
            amount: Number(t.amount),
            type: t.type || 'EXPENSE',
            categoryId: t.categoryId,
            memberId: t.memberId,
            date: t.date ? new Date(t.date) : new Date(),
            note: t.note || null,
            isDeleted: Boolean(t.isDeleted),
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date()
          },
          update: {
            amount: Number(t.amount),
            type: t.type || 'EXPENSE',
            categoryId: t.categoryId,
            memberId: t.memberId,
            date: t.date ? new Date(t.date) : new Date(),
            note: t.note || null,
            isDeleted: Boolean(t.isDeleted),
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date()
          }
        });
      }
    }

    // 2. Fetch server changes since lastSyncedAt
    const currentSyncDate = new Date();

    const updatedMembers = await prisma.householdMember.findMany({
      where: {
        householdId,
        updatedAt: { gt: lastSyncDate }
      }
    });

    const updatedCategories = await prisma.category.findMany({
      where: {
        householdId,
        updatedAt: { gt: lastSyncDate }
      }
    });

    const updatedTransactions = await prisma.transaction.findMany({
      where: {
        householdId,
        updatedAt: { gt: lastSyncDate }
      }
    });

    res.json({
      syncedAt: currentSyncDate.toISOString(),
      updates: {
        members: updatedMembers,
        categories: updatedCategories,
        transactions: updatedTransactions
      }
    });
  } catch (error) {
    console.error('Error en sincronización:', error);
    res.status(500).json({ error: 'Error durante el proceso de sincronización' });
  }
}

module.exports = { syncData };
