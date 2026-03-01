<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Öğretmen Paneli</h1>
        <p class="text-gray-500">{{ user?.schoolName || 'Okul' }} İstatistikleri</p>
      </div>
      <div class="bg-blue-100 p-3 rounded-2xl border border-blue-200">
        <Users class="w-8 h-8 text-blue-600" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-losev-red"></div>
    </div>

    <template v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Onaylı Toplam Saat</p>
          <p class="text-2xl font-black text-gray-900">{{ globalStats.totalApprovedHours.toLocaleString('tr-TR') }}</p>
          <div class="mt-2 flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full w-fit">
            <Clock class="w-3 h-3" />
            Okul Geneli
          </div>
        </div>
        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bekleyen Faaliyetler</p>
          <p class="text-2xl font-black text-gray-900">{{ pendingCount }}</p>
          <div class="mt-2 flex items-center gap-1 text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full w-fit">
            <AlertCircle class="w-3 h-3" />
            İşlem Bekliyor
          </div>
        </div>
      </div>

      <!-- Approval Call to Action -->
      <router-link to="/teacher/approvals" class="bg-losev-red p-6 rounded-3xl shadow-lg shadow-losev-red/20 flex items-center justify-between group active:scale-[0.98] transition-all">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-3 rounded-2xl text-white">
            <CheckCircle class="w-8 h-8" />
          </div>
          <div>
            <h2 class="text-white font-bold text-lg">Onay Bekleyenler</h2>
            <p class="text-white/80 text-sm">Bekleyen {{ pendingCount }} faaliyet var</p>
          </div>
        </div>
        <ArrowRight class="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
      </router-link>

      <!-- Student List Preview -->
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">En Aktif İnci Öğrenciler</h3>
          <router-link to="/admin/rankings" class="text-losev-red text-xs font-bold">Tümünü Gör</router-link>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(student, index) in topStudents" :key="index" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-white shadow-sm">
                {{ student.fullName[0] }}
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900">{{ student.fullName }}</p>
                <p class="text-[10px] text-gray-400 font-medium">{{ student.grade }} - {{ student.schoolName }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-black text-losev-red text-sm">{{ student.totalHours }}s</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase">{{ getBadgeLabel(student.totalHours) }}</p>
            </div>
          </div>
          <div v-if="topStudents.length === 0" class="p-12 text-center text-gray-400">
             Henüz onaylı faaliyet bulunmuyor.
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../../services/api'
import { useAuthStore } from '../../store/auth'
import {
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const loading = ref(false)
const globalStats = ref({ totalApprovedHours: 0 })
const pendingCount = ref(0)
const topStudents = ref([])

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [stats, pending, rankings] = await Promise.all([
      api.get('/activities/stats/global'),
      api.get('/activities/pending'),
      api.get('/activities/stats/rankings')
    ])

    globalStats.value = stats
    pendingCount.value = pending.length
    topStudents.value = rankings.topStudents.slice(0, 5)
  } catch (err) {
    console.error('Failed to fetch teacher dashboard data:', err)
  } finally {
    loading.value = false
  }
}

const getBadgeLabel = (hours) => {
  if (hours >= 200) return 'Platin İnci'
  if (hours >= 100) return 'Altın İnci'
  if (hours >= 50) return 'Gümüş İnci'
  if (hours >= 25) return 'Bronz İnci'
  return 'Gönüllü'
}

onMounted(fetchDashboardData)
</script>
