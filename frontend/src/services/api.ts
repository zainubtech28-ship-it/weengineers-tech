import {
  User,
  ServiceItem,
  ProjectItem,
  TeamMemberItem,
  ReviewItem,
  EnquiryItem,
  FAQItem,
  BlogPostItem,
  CompanySettingsData,
  NotificationItem,
  AuditLogItem,
} from '../types';

const API_BASE = '/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('weengineers_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred during request processing.');
  }
  return data;
}

// PUBLIC API
export const api = {
  // Public
  getSettings: () => fetch(`${API_BASE}/public/settings`).then((r) => handleResponse<{ success: boolean; settings: CompanySettingsData }>(r)),
  getServices: () => fetch(`${API_BASE}/public/services`).then((r) => handleResponse<{ success: boolean; services: ServiceItem[] }>(r)),
  getServiceBySlug: (slug: string) => fetch(`${API_BASE}/public/services/${slug}`).then((r) => handleResponse<{ success: boolean; service: ServiceItem }>(r)),
  getProjects: (params?: { category?: string; search?: string; page?: number; featured?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    if (params?.featured) q.append('featured', 'true');
    return fetch(`${API_BASE}/public/projects?${q.toString()}`).then((r) => handleResponse<{ success: boolean; projects: ProjectItem[]; total: number; totalPages: number }>(r));
  },
  getProjectBySlug: (slug: string) => fetch(`${API_BASE}/public/projects/${slug}`).then((r) => handleResponse<{ success: boolean; project: ProjectItem }>(r)),
  getTeam: () => fetch(`${API_BASE}/public/team`).then((r) => handleResponse<{ success: boolean; team: TeamMemberItem[] }>(r)),
  getReviews: () => fetch(`${API_BASE}/public/reviews`).then((r) => handleResponse<{ success: boolean; reviews: ReviewItem[]; averageRating: number; totalReviews: number }>(r)),
  submitReview: (data: { clientName: string; clientCompany?: string; clientRole?: string; rating: number; reviewText: string; projectId?: string }) =>
    fetch(`${API_BASE}/public/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; reviewId: string }>(r)),
  reportReview: (id: string, reason: string) =>
    fetch(`${API_BASE}/public/reviews/${id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),
  submitEnquiry: (data: {
    fullName: string;
    email: string;
    phone?: string;
    companyName?: string;
    service: string;
    budget?: string;
    timeline?: string;
    description: string;
    preferredContactMethod?: string;
  }) =>
    fetch(`${API_BASE}/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; referenceCode: string }>(r)),
  trackEnquiry: (referenceCode: string) =>
    fetch(`${API_BASE}/public/enquiries/track/${referenceCode}`).then((r) =>
      handleResponse<{
        success: boolean;
        enquiry: {
          referenceCode: string;
          clientName: string;
          service: string;
          status: string;
          submittedAt: string;
          timeline: { status: string; date: string }[];
        };
      }>(r)
    ),
  getBlogs: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    return fetch(`${API_BASE}/public/blog?${q.toString()}`).then((r) => handleResponse<{ success: boolean; blogs: BlogPostItem[] }>(r));
  },
  getBlogBySlug: (slug: string) => fetch(`${API_BASE}/public/blog/${slug}`).then((r) => handleResponse<{ success: boolean; blog: BlogPostItem }>(r)),
  getFAQs: (category?: string) => {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetch(`${API_BASE}/public/faqs${q}`).then((r) => handleResponse<{ success: boolean; faqs: FAQItem[] }>(r));
  },
  getStats: () => fetch(`${API_BASE}/public/stats`).then((r) => handleResponse<{ success: boolean; stats: { publishedProjects: number; verifiedReviews: number; totalServices: number; averageRating: number } }>(r)),

  // Authentication
  login: (credentials: { email: string; password: string; requiredRole?: 'founder' | 'admin' }) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then((r) => handleResponse<{ success: boolean; message: string; token: string; user: User }>(r)),
  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; user: User }>(r)),
  logout: () =>
    fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),
  forgotPassword: (email: string) =>
    fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then((r) => handleResponse<{ success: boolean; message: string; devResetToken?: string }>(r)),
  resetPassword: (data: { token: string; newPassword: string }) =>
    fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin APIs
  getAdminDashboardStats: () =>
    fetch(`${API_BASE}/admin/dashboard-stats`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{
        success: boolean;
        stats: {
          projects: { total: number; published: number; draft: number; archived: number };
          enquiries: { total: number; new: number; byStatus: Record<string, number> };
          reviews: { pending: number };
          notifications: { unread: number };
          recentEnquiries: EnquiryItem[];
          recentProjects: ProjectItem[];
        };
      }>(r)
    ),
  getAdminProjects: (params?: { status?: string; category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    return fetch(`${API_BASE}/admin/projects?${q.toString()}`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; projects: ProjectItem[] }>(r)
    );
  },
  createProject: (data: Partial<ProjectItem>) =>
    fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; project: ProjectItem }>(r)),
  updateProject: (id: string, data: Partial<ProjectItem>) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; project: ProjectItem }>(r)),
  deleteProject: (id: string) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin Services
  getAdminServices: () =>
    fetch(`${API_BASE}/admin/services`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; services: ServiceItem[] }>(r)
    ),
  createService: (data: Partial<ServiceItem>) =>
    fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; service: ServiceItem }>(r)),
  updateService: (id: string, data: Partial<ServiceItem>) =>
    fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; service: ServiceItem }>(r)),
  deleteService: (id: string) =>
    fetch(`${API_BASE}/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin Team
  getAdminTeam: () =>
    fetch(`${API_BASE}/admin/team`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; team: TeamMemberItem[] }>(r)
    ),
  createTeamMember: (data: Partial<TeamMemberItem>) =>
    fetch(`${API_BASE}/admin/team`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; member: TeamMemberItem }>(r)),
  updateTeamMember: (id: string, data: Partial<TeamMemberItem>) =>
    fetch(`${API_BASE}/admin/team/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; member: TeamMemberItem }>(r)),
  deleteTeamMember: (id: string) =>
    fetch(`${API_BASE}/admin/team/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin Enquiries
  getAdminEnquiries: (params?: { status?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    return fetch(`${API_BASE}/admin/enquiries?${q.toString()}`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; enquiries: EnquiryItem[]; total: number; totalPages: number }>(r)
    );
  },
  updateEnquiryStatus: (id: string, status: string, note?: string) =>
    fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note }),
    }).then((r) => handleResponse<{ success: boolean; message: string; enquiry: EnquiryItem }>(r)),
  addEnquiryNote: (id: string, note: string) =>
    fetch(`${API_BASE}/admin/enquiries/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note }),
    }).then((r) => handleResponse<{ success: boolean; message: string; enquiry: EnquiryItem }>(r)),

  // Admin Reviews
  getAdminReviews: () =>
    fetch(`${API_BASE}/admin/reviews`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; reviews: ReviewItem[] }>(r)
    ),
  moderateReview: (id: string, status: 'approved' | 'rejected', note?: string, isVerified?: boolean) =>
    fetch(`${API_BASE}/admin/reviews/${id}/moderate`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note, isVerified }),
    }).then((r) => handleResponse<{ success: boolean; message: string; review: ReviewItem }>(r)),
  deleteReview: (id: string) =>
    fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin FAQs & Blogs
  getAdminFAQs: () =>
    fetch(`${API_BASE}/admin/faqs`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; faqs: FAQItem[] }>(r)
    ),
  createFAQ: (data: Partial<FAQItem>) =>
    fetch(`${API_BASE}/admin/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; faq: FAQItem }>(r)),
  updateFAQ: (id: string, data: Partial<FAQItem>) =>
    fetch(`${API_BASE}/admin/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; faq: FAQItem }>(r)),
  deleteFAQ: (id: string) =>
    fetch(`${API_BASE}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  getAdminBlogs: () =>
    fetch(`${API_BASE}/admin/blogs`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; blogs: BlogPostItem[] }>(r)
    ),
  createBlogPost: (data: Partial<BlogPostItem>) =>
    fetch(`${API_BASE}/admin/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; blog: BlogPostItem }>(r)),
  updateBlogPost: (id: string, data: Partial<BlogPostItem>) =>
    fetch(`${API_BASE}/admin/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; blog: BlogPostItem }>(r)),
  deleteBlogPost: (id: string) =>
    fetch(`${API_BASE}/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Admin Settings
  getAdminSettings: () =>
    fetch(`${API_BASE}/admin/settings`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; settings: CompanySettingsData }>(r)
    ),
  updateAdminSettings: (data: Partial<CompanySettingsData>) =>
    fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; settings: CompanySettingsData }>(r)),

  // Notifications
  getNotifications: () =>
    fetch(`${API_BASE}/admin/notifications`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; unreadCount: number; notifications: NotificationItem[] }>(r)
    ),
  markNotificationRead: (id: string) =>
    fetch(`${API_BASE}/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),

  // Audit Logs
  getAuditLogs: (params?: { module?: string; action?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.module) q.append('module', params.module);
    if (params?.action) q.append('action', params.action);
    if (params?.search) q.append('search', params.search);
    if (params?.page) q.append('page', String(params.page));
    return fetch(`${API_BASE}/admin/audit-logs?${q.toString()}`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; logs: AuditLogItem[]; total: number; totalPages: number }>(r)
    );
  },

  // FOUNDER-EXCLUSIVE APIS
  getFounderOverview: () =>
    fetch(`${API_BASE}/founder/overview`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{
        success: boolean;
        executive: {
          totalProjects: number;
          publishedProjects: number;
          draftProjects: number;
          totalEnquiries: number;
          newEnquiries: number;
          conversionRate: number;
          totalAdmins: number;
          approvedReviews: number;
          averageRating: number;
          servicePopularity: { name: string; count: number }[];
          monthlyTrends: { name: string; enquiries: number }[];
          recentAuditLogs: AuditLogItem[];
          recentEnquiries: EnquiryItem[];
        };
      }>(r)
    ),
  getAdministrators: () =>
    fetch(`${API_BASE}/founder/administrators`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{ success: boolean; admins: User[] }>(r)
    ),
  createAdministrator: (data: { name: string; email: string; password: string; phone?: string; permissions?: string[] }) =>
    fetch(`${API_BASE}/founder/administrators`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; admin: User }>(r)),
  toggleAdminStatus: (id: string, status: 'active' | 'inactive') =>
    fetch(`${API_BASE}/founder/administrators/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),
  deleteAdministrator: (id: string) =>
    fetch(`${API_BASE}/founder/administrators/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => handleResponse<{ success: boolean; message: string }>(r)),
  getSystemHealth: () =>
    fetch(`${API_BASE}/founder/system-health`, { headers: getAuthHeaders() }).then((r) =>
      handleResponse<{
        success: boolean;
        settings: CompanySettingsData;
        systemHealth: {
          databaseStatus: string;
          uptimeSeconds: number;
          memoryUsageMb: number;
          nodeVersion: string;
          environment: string;
          serverTime: string;
        };
      }>(r)
    ),
  updateCompanyBranding: (data: Partial<CompanySettingsData>) =>
    fetch(`${API_BASE}/founder/company-branding`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then((r) => handleResponse<{ success: boolean; message: string; settings: CompanySettingsData }>(r)),

  // File Upload
  uploadMedia: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('weengineers_token');

    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(res);
  },
};
