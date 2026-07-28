<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Satu akun hanya boleh punya satu ulasan per UMKM (pola Play Store):
 * kirim ulang = memperbarui ulasan lama, bukan menambah baris baru.
 */
class ReviewUpsertTest extends TestCase
{
    use RefreshDatabase;

    private function umkm(): Umkm
    {
        return Umkm::create([
            'name' => 'Warung Uji',
            'category' => 'Kuliner',
            'location' => 'Balikpapan Kota',
            'rating' => 0,
            'reviews_count' => 0,
        ]);
    }

    private function user(string $name = 'Rizky Pratama'): User
    {
        return User::create([
            'name' => $name,
            'email' => str($name)->slug().'@test.local',
            'password' => bcrypt('secret'),
        ]);
    }

    public function test_ulasan_kedua_memperbarui_yang_lama_bukan_menambah_baris(): void
    {
        $umkm = $this->umkm();
        Sanctum::actingAs($this->user());

        $this->postJson("/api/umkm/{$umkm->id}/reviews", ['stars' => 5, 'text' => 'ULASAN LAMA'])
            ->assertCreated();

        $this->postJson("/api/umkm/{$umkm->id}/reviews", ['stars' => 3, 'text' => 'ULASAN BARU'])
            ->assertOk();

        $this->assertSame(1, Review::count(), 'Harus tetap satu baris ulasan.');
        $this->assertSame('ULASAN BARU', Review::first()->text);
        $this->assertSame(3, Review::first()->stars);

        // Jumlah pengulas tidak ikut bertambah, dan rating memakai bintang terbaru.
        $umkm->refresh();
        $this->assertSame(1, $umkm->reviews_count);
        $this->assertEqualsWithDelta(3.0, (float) $umkm->rating, 0.01);
    }

    public function test_dua_user_berbeda_tetap_punya_ulasan_masing_masing(): void
    {
        $umkm = $this->umkm();

        Sanctum::actingAs($this->user('Rizky Pratama'));
        $this->postJson("/api/umkm/{$umkm->id}/reviews", ['stars' => 5, 'text' => 'dari rizky'])->assertCreated();

        Sanctum::actingAs($this->user('Dewi Anjani'));
        $this->postJson("/api/umkm/{$umkm->id}/reviews", ['stars' => 4, 'text' => 'dari dewi'])->assertCreated();

        $this->assertSame(2, Review::count());
        $this->assertSame(2, $umkm->fresh()->reviews_count);
    }

    public function test_user_yang_sama_boleh_mengulas_umkm_berbeda(): void
    {
        $a = $this->umkm();
        $b = $this->umkm();
        Sanctum::actingAs($this->user());

        $this->postJson("/api/umkm/{$a->id}/reviews", ['stars' => 5, 'text' => 'di A'])->assertCreated();
        $this->postJson("/api/umkm/{$b->id}/reviews", ['stars' => 4, 'text' => 'di B'])->assertCreated();

        $this->assertSame(2, Review::count());
    }

    public function test_endpoint_mine_mengembalikan_ulasan_untuk_prefill_form(): void
    {
        $umkm = $this->umkm();
        Sanctum::actingAs($this->user());

        // Belum pernah mengulas → null, form tampil sebagai "buat baru".
        $this->getJson("/api/umkm/{$umkm->id}/reviews/mine")
            ->assertOk()
            ->assertJson(['data' => null]);

        $this->postJson("/api/umkm/{$umkm->id}/reviews", ['stars' => 4, 'text' => 'enak']);

        $this->getJson("/api/umkm/{$umkm->id}/reviews/mine")
            ->assertOk()
            ->assertJsonPath('data.text', 'enak')
            ->assertJsonPath('data.stars', 4);
    }
}
