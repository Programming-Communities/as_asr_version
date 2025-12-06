import { NextRequest, NextResponse } from 'next/server';

interface Notification {
  id: string;
  userId: string;
  type: 'comment_reply' | 'reaction' | 'new_post' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

// In-memory store for demo
let notifications: Notification[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let userNotifications = notifications.filter(n => n.userId === userId);

    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type);
    }

    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedNotifications = userNotifications.slice(start, end);

    const unreadCount = userNotifications.filter(n => !n.read).length;

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total: userNotifications.length,
          totalPages: Math.ceil(userNotifications.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, link, data } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString(),
      data,
    };

    notifications.push(newNotification);

    // Send push notification if PWA is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_PWA === 'true') {
      try {
        // This would trigger a push notification in a real PWA
        console.log('📱 PWA Notification:', { title, message });
      } catch (pushError) {
        console.error('Push notification error:', pushError);
      }
    }

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully',
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationIds, markAllAsRead } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    if (markAllAsRead) {
      notifications = notifications.map(notification => 
        notification.userId === userId && !notification.read
          ? { ...notification, read: true }
          : notification
      );
      updatedCount = notifications.filter(n => n.userId === userId && !n.read).length;
    } else if (notificationIds && Array.isArray(notificationIds)) {
      notifications = notifications.map(notification => 
        notification.userId === userId && notificationIds.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      );
      updatedCount = notificationIds.length;
    }

    return NextResponse.json({
      success: true,
      data: { updatedCount },
      message: `${updatedCount} notification(s) marked as read`,
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const notificationId = searchParams.get('notificationId');
    const deleteAllRead = searchParams.get('deleteAllRead') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const initialLength = notifications.length;

    if (notificationId) {
      notifications = notifications.filter(
        n => !(n.userId === userId && n.id === notificationId)
      );
    } else if (deleteAllRead) {
      notifications = notifications.filter(
        n => !(n.userId === userId && n.read)
      );
    }

    const deletedCount = initialLength - notifications.length;

    return NextResponse.json({
      success: deletedCount > 0,
      data: { deletedCount },
      message: `${deletedCount} notification(s) deleted`,
    });
  } catch (error) {
    console.error('Delete notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}