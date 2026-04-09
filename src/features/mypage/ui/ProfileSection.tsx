import { useState } from 'react';

import { Modal } from '@/shared/ui';

import { useMyProfile, useUpdateProfile } from '../hooks/useMyProfile';
import { UpdateProfileRequest } from '../types/mypage.types';

export const ProfileSection = () => {
  const { profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState<UpdateProfileRequest>({});

  const handleOpenEdit = () => {
    setForm({
      username: profile?.username ?? '',
      address: profile?.address,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form, {
      onSuccess: () => setIsEditModalOpen(false),
    });
  };

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    if (field === 'username' || field === 'password') {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      address: {
        country: prev.address?.country ?? '',
        region: prev.address?.region ?? '',
        ...prev.address,
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="border rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-48" />
          ))}
        </div>
      </div>
    );
  }

  const address = profile?.address
    ? [profile.address.street, profile.address.region, profile.address.country]
        .filter(Boolean)
        .join(', ')
    : '-';

  return (
    <>
      <div className="border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-base">내 프로필</h2>
          <button
            onClick={handleOpenEdit}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            수정하기
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex gap-8">
            <dt className="text-gray-400 w-12 shrink-0">이름</dt>
            <dd>{profile?.username ?? '-'}</dd>
          </div>
          <div className="flex gap-8">
            <dt className="text-gray-400 w-12 shrink-0">이메일</dt>
            <dd>{profile?.email ?? '-'}</dd>
          </div>
          <div className="flex gap-8">
            <dt className="text-gray-400 w-12 shrink-0">주소</dt>
            <dd>{address}</dd>
          </div>
        </dl>
      </div>

      <Modal
        isModalOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        className="w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">프로필 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-username" className="block text-sm text-gray-600 mb-1">
              이름
            </label>
            <input
              id="profile-username"
              type="text"
              value={form.username ?? ''}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="profile-country" className="block text-sm text-gray-600 mb-1">
              국가
            </label>
            <input
              id="profile-country"
              type="text"
              value={form.address?.country ?? ''}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="profile-region" className="block text-sm text-gray-600 mb-1">
              지역
            </label>
            <input
              id="profile-region"
              type="text"
              value={form.address?.region ?? ''}
              onChange={(e) => handleAddressChange('region', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="profile-street" className="block text-sm text-gray-600 mb-1">
              상세 주소
            </label>
            <input
              id="profile-street"
              type="text"
              value={form.address?.street ?? ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="profile-password" className="block text-sm text-gray-600 mb-1">
              새 비밀번호 (변경 시 입력)
            </label>
            <input
              id="profile-password"
              type="password"
              value={form.password ?? ''}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="변경하지 않으면 비워두세요"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
